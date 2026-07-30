import discord
from discord.ext import commands, tasks
import discord.app_commands as app_commands
import logging
import json
import os
import sys
import traceback
import asyncio
import subprocess
import shutil
from datetime import datetime, timezone, timedelta
from config import Config
from utils.data import load, save
from utils.prefix_manager import get_prefixes
from utils.embed import success_embed, error_embed, info_embed, warning_embed
import threading
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

def install_ffmpeg():
    ffmpeg_path = shutil.which('ffmpeg')
    if ffmpeg_path:
        print(f"✅ FFmpeg found at: {ffmpeg_path}")
        return True
    print("📦 FFmpeg not found. Attempting to install...")
    try:
        subprocess.run(['apt-get', 'update'], check=True, capture_output=True)
        subprocess.run(['apt-get', 'install', '-y', 'ffmpeg'], check=True, capture_output=True)
        print("✅ FFmpeg installed successfully!")
        return True
    except Exception as e:
        print(f"⚠️ Could not install FFmpeg via apt-get: {e}")
        try:
            subprocess.run(['pip', 'install', 'ffmpeg-python'], check=True, capture_output=True)
            print("✅ ffmpeg-python installed (wrapper only - may not work without binary)")
        except Exception as e2:
            print(f"⚠️ Could not install ffmpeg-python: {e2}")
        ffmpeg_path = shutil.which('ffmpeg')
        if ffmpeg_path:
            print(f"✅ FFmpeg found at: {ffmpeg_path}")
            return True
        print("❌ FFmpeg installation failed. Music commands will not work.")
        return False

install_ffmpeg()

ws_app = FastAPI()
ws_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_websockets = []

@ws_app.get("/api/status")
async def api_status():
    bot = ws_app.state.bot if hasattr(ws_app.state, 'bot') else None
    if not bot:
        return {"status": "unknown", "servers": 0, "users": 0, "uptime": "0s"}
    guild_count = len(bot.guilds)
    user_count = sum(g.member_count for g in bot.guilds)
    if bot.start_time:
        delta = datetime.now(timezone.utc) - bot.start_time
        uptime = str(delta).split('.')[0]
    else:
        uptime = "0s"
    return {"status": "online", "servers": guild_count, "users": user_count, "uptime": uptime}

def _require_secret(x_api_secret: str = Header(default="")):
    if not x_api_secret or x_api_secret != Config.DASHBOARD_API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid or missing API secret.")

def _dashboard_bot():
    bot = getattr(ws_app.state, "bot", None)
    if not bot:
        raise HTTPException(status_code=503, detail="Bot is still starting up.")
    return bot

def _member_can_manage(guild: discord.Guild, user_id: int) -> bool:
    member = guild.get_member(user_id)
    if not member:
        return False
    perms = member.guild_permissions
    return perms.administrator or perms.manage_guild

@ws_app.get("/api/commands")
async def api_commands(x_api_secret: str = Header(default="")):
    _require_secret(x_api_secret)
    bot = _dashboard_bot()
    from cogs.help import module_name

    results = []
    for cog_name, cog in bot.cogs.items():
        mod = module_name(cog_name)
        for cmd in cog.walk_commands():
            if cmd.hidden:
                continue
            results.append({
                "name": f"{Config.PREFIX}{cmd.qualified_name}",
                "description": cmd.help or "No description set.",
                "module": mod,
            })
    results.sort(key=lambda c: (c["module"], c["name"]))
    return {"commands": results}

@ws_app.get("/api/users/{user_id}/guilds")
async def api_user_guilds(user_id: int, x_api_secret: str = Header(default="")):
    _require_secret(x_api_secret)
    bot = _dashboard_bot()
    guild_ids = [g.id for g in bot.guilds if _member_can_manage(g, user_id)]
    return {"guild_ids": guild_ids}

@ws_app.get("/api/guilds/{guild_id}/settings")
async def api_get_guild_settings(guild_id: int, user_id: int = Query(...), x_api_secret: str = Header(default="")):
    _require_secret(x_api_secret)
    bot = _dashboard_bot()
    guild = bot.get_guild(guild_id)
    if not guild:
        raise HTTPException(status_code=404, detail="Bot is not in that server.")
    if not _member_can_manage(guild, user_id):
        raise HTTPException(status_code=403, detail="You don't have permission to manage this server.")

    settings = load("guild_settings.json").get(str(guild_id), {})
    automod = settings.get("automod", {})
    prefixes = get_prefixes(guild_id)

    return {
        "guild": {"id": guild.id, "name": guild.name, "icon": str(guild.icon.url) if guild.icon else None,
                   "member_count": guild.member_count},
        "prefix": prefixes[0] if prefixes else Config.PREFIX,
        "welcome_enabled": settings.get("welcome_enabled", True),
        "welcome_channel": settings.get("welcome_channel"),
        "goodbye_channel": settings.get("goodbye_channel"),
        "mod_log_channel": settings.get("mod_log_channel"),
        "automod_enabled": automod.get("enabled", True),
        "automod_anti_spam": automod.get("anti_spam", True),
        "automod_anti_invite": automod.get("anti_invite", True),
        "automod_anti_links": automod.get("anti_links", False),
        "automod_caps_filter": automod.get("caps_filter", True),
        "channels": [{"id": c.id, "name": c.name} for c in guild.text_channels],
    }

@ws_app.post("/api/guilds/{guild_id}/settings")
async def api_set_guild_settings(guild_id: int, payload: dict, x_api_secret: str = Header(default="")):
    _require_secret(x_api_secret)
    bot = _dashboard_bot()
    guild = bot.get_guild(guild_id)
    if not guild:
        raise HTTPException(status_code=404, detail="Bot is not in that server.")

    user_id = payload.get("user_id")
    if not user_id or not _member_can_manage(guild, int(user_id)):
        raise HTTPException(status_code=403, detail="You don't have permission to manage this server.")

    data = load("guild_settings.json")
    gd = data.setdefault(str(guild_id), {})

    if "prefix" in payload and payload["prefix"]:
        from utils.prefix_manager import set_prefixes
        set_prefixes(guild_id, [payload["prefix"]])

    for key in ("welcome_enabled", "welcome_channel", "goodbye_channel", "mod_log_channel"):
        if key in payload:
            gd[key] = payload[key]

    automod_keys = {
        "automod_enabled": "enabled",
        "automod_anti_spam": "anti_spam",
        "automod_anti_invite": "anti_invite",
        "automod_anti_links": "anti_links",
        "automod_caps_filter": "caps_filter",
    }
    automod = gd.setdefault("automod", {})
    for payload_key, settings_key in automod_keys.items():
        if payload_key in payload:
            automod[settings_key] = payload[payload_key]

    save("guild_settings.json", data)
    return {"ok": True}

@ws_app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_websockets.append(websocket)
    from utils import broadcast
    broadcast.set_connections(active_websockets)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in active_websockets:
            active_websockets.remove(websocket)
            broadcast.set_connections(active_websockets)

def run_websocket_server():
    uvicorn.run(ws_app, host="0.0.0.0", port=25567)

def start_websocket_server():
    threading.Thread(target=run_websocket_server, daemon=True).start()

class VoiceWarningFilter(logging.Filter):
    def filter(self, record):
        msg = record.getMessage()
        if "PyNaCl is not installed" in msg:
            return False
        if "davey is not installed" in msg:
            return False
        return True

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s | %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

discord_logger = logging.getLogger("discord.client")
discord_logger.addFilter(VoiceWarningFilter())

log = logging.getLogger("SparkyBot")

intents = discord.Intents.all()

OWNER_IDS = [1077905352244338688]

def get_all_owners():
    config_owners = getattr(Config, "OWNER_IDS", [])
    if isinstance(config_owners, list):
        return list(set(config_owners + OWNER_IDS))
    elif isinstance(config_owners, int):
        return list(set([config_owners] + OWNER_IDS))
    else:
        return OWNER_IDS

def is_owner():
    async def predicate(ctx):
        all_owners = get_all_owners()
        return ctx.author.id in all_owners
    return commands.check(predicate)

def _get_owner_log_channel():
    try:
        data = load("owner.json")
        return data.get("log_channel")
    except Exception:
        return None

async def _send_to_owner_log(bot, embed: discord.Embed = None, content: str = None):
    channel_id = _get_owner_log_channel()
    if not channel_id:
        if embed:
            log.info(f"[OWNER LOG] (No channel set): {embed.title if embed.title else 'Log entry'}")
            if embed.description:
                log.info(f"[OWNER LOG DESC] {embed.description[:200]}")
        if content:
            log.info(f"[OWNER LOG CONTENT] {content[:200]}")
        return
    channel = bot.get_channel(channel_id)
    if not channel:
        try:
            data = load("owner.json")
            data.pop("log_channel", None)
            save("owner.json", data)
        except Exception:
            pass
        log.warning(f"Owner log channel {channel_id} not found - cleared setting")
        return
    try:
        if embed:
            await channel.send(content=content, embed=embed)
        elif content:
            await channel.send(content)
        log.info(f"✅ Sent to owner log channel {channel_id}")
    except discord.Forbidden:
        log.warning(f"Missing permissions to send to owner log channel {channel_id}")
    except Exception as e:
        log.error(f"Failed to send to owner log channel: {e}")

async def send_log_to_owners(bot, title: str, description: str, color=Config.COLOR_INFO):
    embed = discord.Embed(
        title=title,
        description=description,
        color=color,
        timestamp=datetime.now(timezone.utc)
    )
    embed.set_footer(text="Sparky Bot • Owner Log")
    await _send_to_owner_log(bot, embed=embed)

def save_guild_names(guilds):
    os.makedirs(Config.DATA_DIR, exist_ok=True)
    path = os.path.join(Config.DATA_DIR, "guild_names.json")
    try:
        with open(path, "r") as f:
            data = json.load(f)
    except Exception:
        data = {}
    for g in guilds:
        data[str(g.id)] = {
            "name": g.name,
            "icon": str(g.icon.url) if g.icon else None,
            "member_count": g.member_count,
        }
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def get_shard_settings():
    shard_id = int(os.getenv("SHARD_ID", 0))
    shard_count = int(os.getenv("SHARD_COUNT", 0))
    if len(sys.argv) >= 3 and shard_count == 0:
        shard_id = int(sys.argv[1])
        shard_count = int(sys.argv[2])
    if shard_count == 0:
        try:
            with open("data/guild_names.json", "r") as f:
                guilds = json.load(f)
                server_count = len(guilds)
                if server_count <= 2500:
                    shard_count = 1
                elif server_count <= 5000:
                    shard_count = 2
                elif server_count <= 7500:
                    shard_count = 3
                elif server_count <= 10000:
                    shard_count = 4
                else:
                    shard_count = 5
                log.info(f"📊 Auto-detected {server_count} servers → {shard_count} shard(s)")
        except Exception as e:
            log.warning(f"Could not auto-detect shard count: {e}")
            shard_count = 1
    return shard_id, shard_count

async def get_custom_prefix(bot, message):
    if not message.guild:
        return ["//"]
    prefixes = get_prefixes(message.guild.id)
    if "//" not in prefixes:
        prefixes.append("//")
    return prefixes

class SparkyBot(commands.Bot):
    def __init__(self):
        all_owners = get_all_owners()
        shard_id, shard_count = get_shard_settings()
        self._shard_id = shard_id
        self._shard_count = shard_count
        if shard_count > 1:
            super().__init__(
                command_prefix=get_custom_prefix,
                intents=intents,
                help_command=None,
                case_insensitive=True,
                strip_after_prefix=True,
                owner_ids=set(all_owners),
                shard_id=shard_id,
                shard_count=shard_count,
            )
            self.shard_mode = f"Manual ({shard_id+1}/{shard_count})"
        else:
            super().__init__(
                command_prefix=get_custom_prefix,
                intents=intents,
                help_command=None,
                case_insensitive=True,
                strip_after_prefix=True,
                owner_ids=set(all_owners),
                shard_count=None,
            )
            self.shard_mode = "Auto (Single)"
        self.start_time = None
        self.last_cache_clear = None
        self.status_webhook = None
        self._loaded_cogs = set()
        start_websocket_server()
        ws_app.state.bot = self

    async def setup_hook(self):
        cogs = [
            "cogs.application",
            "cogs.tickets",
            "cogs.logging_cog",
            "cogs.automod",
            "cogs.antinuke",
            "cogs.jtc",
            "cogs.moderation",
            "cogs.admin",
            "cogs.reports",
            "cogs.economy",
            "cogs.leveling",
            "cogs.utility",
            "cogs.fun",
            "cogs.welcome",
            "cogs.giveaway",
            "cogs.reaction_roles",
            "cogs.invite_tracking",
            "cogs.embed",
            "cogs.forumlock",
            "cogs.owner",
            "cogs.verification",
            "cogs.music",
            "cogs.prefix",
            "cogs.translation",
            "cogs.help",
            "cogs.youtube",
        ]
        for cog in cogs:
            cog_name = cog.split(".")[-1].title()
            if cog_name in self.cogs:
                log.info(f"⏭️ Cog '{cog_name}' already loaded, skipping...")
                continue
            if cog in self._loaded_cogs:
                log.info(f"⏭️ Cog '{cog}' already loaded in this session, skipping...")
                continue
            try:
                await self.load_extension(cog)
                log.info(f"✅ Loaded cog: {cog}")
                self._loaded_cogs.add(cog)
            except Exception as e:
                log.error(f"❌ Failed to load {cog}: {e}\n{traceback.format_exc()}")
        try:
            from cogs.tickets import TicketPanelView, TicketControlView
            self.add_view(TicketPanelView({}))
            self.add_view(TicketControlView())
            log.info("✅ Registered persistent views for ticket system")
        except Exception as e:
            log.error(f"❌ Failed to register ticket views: {e}")
        try:
            from cogs.reports import ReportPanelView, SuggestionPanelView, BugReportPanelView
            self.add_view(ReportPanelView())
            self.add_view(SuggestionPanelView())
            self.add_view(BugReportPanelView())
            log.info("✅ Registered persistent views for reports system")
        except Exception as e:
            log.error(f"❌ Failed to register report views: {e}")
        try:
            from cogs.jtc import JTCControlPanel
            self.add_view(JTCControlPanel())
            log.info("✅ Registered persistent views for JTC system")
        except Exception as e:
            log.error(f"❌ Failed to register JTC views: {e}")
        try:
            from cogs.embed import RulesView
            self.add_view(RulesView("_placeholder", []))
            log.info("✅ Registered persistent views for embed/rules system")
        except Exception as e:
            log.error(f"❌ Failed to register embed views: {e}")
        log.info("ℹ️ Application persistent views disabled (not needed for slash commands).")
        try:
            from utils.status_webhook import StatusWebhook
            self.status_webhook = StatusWebhook(self)
            await self.status_webhook.start()
            log.info("✅ Status webhook started")
        except Exception as e:
            log.error(f"❌ Failed to start status webhook: {e}")
        dev_guild_id = getattr(Config, "DEV_GUILD_ID", None)
        if dev_guild_id:
            guild_obj = discord.Object(id=dev_guild_id)
            self.tree.copy_global_to(guild=guild_obj)
            try:
                synced = await self.tree.sync(guild=guild_obj)
                log.info(f"DEV: Synced {len(synced)} slash commands to guild {dev_guild_id} (instant).")
            except Exception as e:
                log.error(f"Guild sync failed: {e}")
        else:
            try:
                synced = await self.tree.sync()
                log.info(f"PROD: Synced {len(synced)} slash commands globally (~1 hour to propagate).")
            except Exception as e:
                log.error(f"Global sync failed: {e}")
        self.update_status.start()

    @tasks.loop(minutes=5)
    async def update_status(self):
        guild_count = len(self.guilds)
        user_count = sum(g.member_count for g in self.guilds)
        await self.change_presence(
            activity=discord.Activity(
                type=discord.ActivityType.watching,
                name=f"{guild_count} servers | {user_count} users",
            ),
            status=discord.Status.dnd,
        )

    @update_status.before_loop
    async def before_update_status(self):
        await self.wait_until_ready()

    async def on_ready(self):
        self.start_time = datetime.now(timezone.utc)
        self.last_cache_clear = datetime.now(timezone.utc)
        log.info(f"✅ Logged in as {self.user} (ID: {self.user.id})")
        log.info(f"📊 Connected to {len(self.guilds)} guild(s)")
        log.info(f"🔀 Shard: {self.shard_mode}")
        save_guild_names(self.guilds)
        guild_count = len(self.guilds)
        user_count = sum(g.member_count for g in self.guilds)
        await self.change_presence(
            activity=discord.Activity(
                type=discord.ActivityType.watching,
                name=f"{guild_count} servers | {user_count} users",
            ),
            status=discord.Status.dnd,
        )
        from utils.broadcast import broadcast
        await broadcast({
            "type": "status",
            "status": "online",
            "servers": len(self.guilds),
            "users": sum(g.member_count for g in self.guilds),
            "uptime": str(datetime.now(timezone.utc) - self.start_time).split('.')[0]
        })
        all_owners = get_all_owners()
        owner_ids_str = ", ".join(str(oid) for oid in all_owners)
        channel_id = _get_owner_log_channel()
        if channel_id:
            channel = self.get_channel(channel_id)
            if channel:
                log.info(f"✅ Owner log channel: #{channel.name} ({channel_id})")
            else:
                log.warning(f"⚠️ Owner log channel {channel_id} not found - clearing setting")
                try:
                    data = load("owner.json")
                    data.pop("log_channel", None)
                    save("owner.json", data)
                except Exception:
                    pass
        await send_log_to_owners(
            self,
            "✅ Bot Online",
            f"**Bot:** {self.user} (ID: {self.user.id})\n"
            f"**Owners:** `{owner_ids_str}`\n"
            f"**Shard:** {self.shard_mode}\n"
            f"**Servers:** {len(self.guilds)}",
            Config.COLOR_OK
        )
        self.loop.create_task(self._clear_cache_loop())

    async def _clear_cache_loop(self):
        await self.wait_until_ready()
        while not self.is_closed():
            now = datetime.now(timezone.utc)
            if self.last_cache_clear and (now - self.last_cache_clear).days >= 7:
                await self._clear_caches()
                self.last_cache_clear = now
                log.info("🧹 Cleared bot caches (weekly maintenance)")
                await send_log_to_owners(
                    self,
                    "🧹 Weekly Cache Clearing",
                    "All caches have been cleared successfully.",
                    Config.COLOR_INFO
                )
            await asyncio.sleep(3600)

    async def _clear_caches(self):
        try:
            try:
                from cogs.tickets import _transcript_cache
                _transcript_cache.clear()
                log.info("🧹 Cleared transcript cache")
            except Exception as e:
                log.error(f"Failed to clear transcript cache: {e}")
            try:
                for cog in self.cogs.values():
                    if hasattr(cog, "_spam_tracker"):
                        cog._spam_tracker.clear()
                    if hasattr(cog, "_last_action"):
                        cog._last_action.clear()
                log.info("🧹 Cleared spam tracker")
            except Exception as e:
                log.error(f"Failed to clear spam tracker: {e}")
            try:
                from cogs.application import _submission_times, _active_sessions
                _submission_times.clear()
                _active_sessions.clear()
                log.info("🧹 Cleared application cache")
            except Exception as e:
                log.error(f"Failed to clear application cache: {e}")
            try:
                for cog in self.cogs.values():
                    if hasattr(cog, "_running"):
                        cog._running.clear()
                log.info("🧹 Cleared giveaway cache")
            except Exception as e:
                log.error(f"Failed to clear giveaway cache: {e}")
            try:
                for cog in self.cogs.values():
                    if hasattr(cog, "_invite_cache"):
                        cog._invite_cache.clear()
                log.info("🧹 Cleared invite cache")
            except Exception as e:
                log.error(f"Failed to clear invite cache: {e}")
            log.info("🧹 All caches cleared successfully")
        except Exception as e:
            log.error(f"Failed to clear caches: {e}")

    async def on_guild_join(self, guild):
        log.info(f"➕ Bot joined new guild: `{guild.name}` (ID: {guild.id})")
        save_guild_names(self.guilds)
        await send_log_to_owners(
            self,
            "➕ Joined New Guild",
            f"**Name:** {guild.name}\n**ID:** {guild.id}\n**Members:** {guild.member_count}\n**Now in:** {len(self.guilds)} servers",
            Config.COLOR_OK
        )

    async def on_guild_remove(self, guild):
        log.info(f"➖ Bot left guild: `{guild.name}` (ID: {guild.id})")
        save_guild_names(self.guilds)
        await send_log_to_owners(
            self,
            "➖ Left Guild",
            f"**Name:** {guild.name}\n**ID:** {guild.id}\n**Members:** {guild.member_count}\n**Now in:** {len(self.guilds)} servers",
            Config.COLOR_ERR
        )

    async def on_command_completion(self, ctx):
        from utils.broadcast import broadcast
        await broadcast({
            "type": "command",
            "command": ctx.command.name,
            "user": str(ctx.author),
            "guild": str(ctx.guild) if ctx.guild else "DM"
        })

    async def on_command_error(self, ctx, error):
        if isinstance(error, commands.CommandNotFound):
            return

        known = {
            commands.MissingPermissions: lambda e: "You don't have permission to use this command.",
            commands.BotMissingPermissions: lambda e: f"I'm missing permissions: `{', '.join(e.missing_permissions)}`",
            commands.MissingRequiredArgument: lambda e: f"Missing argument: `{e.param.name}`.",
            commands.BadArgument: lambda e: "That argument isn't valid.",
            commands.CommandOnCooldown: lambda e: f"Slow down. Try again in `{e.retry_after:.1f}s`.",
            commands.NoPrivateMessage: lambda e: "This command only works inside a server.",
            commands.CheckFailure: lambda e: "You don't have access to this command.",
        }
        for err_type, builder in known.items():
            if isinstance(error, err_type):
                try:
                    await ctx.reply(embed=error_embed(builder(error), bot=self), mention_author=False)
                except (discord.NotFound, discord.Forbidden, AttributeError):
                    pass
                return

        error_msg = f"Unhandled error in {ctx.command}: {error}\n{traceback.format_exc()}"
        log.error(error_msg)
        await send_log_to_owners(
            self,
            "Command Error",
            f"**Command:** {ctx.command}\n**User:** {ctx.author}\n**Guild:** {ctx.guild.name if ctx.guild else 'DM'}\n```py\n{error_msg[:1900]}\n```",
            Config.COLOR_ERR
        )
        try:
            await ctx.reply(embed=error_embed("Something went wrong on my end. The owners have been notified.", bot=self), mention_author=False)
        except (discord.NotFound, discord.Forbidden, AttributeError):
            log.warning(f"Could not reply to {ctx.author} - channel no longer exists.")

    async def on_app_command_error(self, interaction: discord.Interaction, error: discord.app_commands.AppCommandError):
        msg = "Something went wrong running that command."
        if isinstance(error, discord.app_commands.MissingPermissions):
            msg = f"You need: `{'`, `'.join(error.missing_permissions)}`"
        elif isinstance(error, discord.app_commands.BotMissingPermissions):
            msg = f"I need: `{'`, `'.join(error.missing_permissions)}`"
        elif isinstance(error, discord.app_commands.CommandOnCooldown):
            msg = f"Slow down. Try again in `{error.retry_after:.1f}s`."
        else:
            error_msg = f"Slash command error: {error}\n{traceback.format_exc()}"
            log.error(error_msg)
            await send_log_to_owners(
                self,
                "Slash Command Error",
                f"**Command:** {interaction.command.name if interaction.command else 'Unknown'}\n**User:** {interaction.user}\n**Guild:** {interaction.guild.name if interaction.guild else 'DM'}\n```py\n{error_msg[:1900]}\n```",
                Config.COLOR_ERR
            )
        try:
            embed = error_embed(msg, bot=self)
            if interaction.response.is_done():
                await interaction.followup.send(embed=embed, ephemeral=True)
            else:
                await interaction.response.send_message(embed=embed, ephemeral=True)
        except (discord.NotFound, discord.Forbidden, AttributeError):
            log.warning(f"Could not reply to interaction - channel no longer exists.")

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 SparkyBot Starting...")
    print("=" * 50)
    shard_id, shard_count = get_shard_settings()
    if shard_count > 1:
        print(f"🔀 Shard mode: Manual ({shard_id+1}/{shard_count})")
    else:
        print(f"🔀 Shard mode: Single process")
    if not Config.TOKEN or Config.TOKEN == "YOUR_BOT_TOKEN_HERE":
        log.error("No bot token set! Edit TOKEN in config.py before running.")
        sys.exit(1)
    bot = SparkyBot()
    bot.run(Config.TOKEN, log_handler=None)
