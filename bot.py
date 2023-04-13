import os
import discord
from dotenv import load_dotenv
from discord.ext import tasks

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
SERVER_NAME = os.getenv('SERVER_NAME')
BACKOFF_TIME = int(os.getenv('BACKOFF_TIME'))
NOTIFICATION_CHANNEL = int(os.getenv('NOTIFICATION_CHANNEL_ID'))
WELCOME_CHANNEL = int(os.getenv('WELCOME_CHANNEL_ID'))
ALLOWED_ROLES = os.getenv('ALLOWED_ROLES').split(',')

intents = discord.Intents.default()
intents.members = True

client = discord.Client(intents=intents)

users_info = {}
warning_list = {}

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')
    check_users.start()

@client.event
async def on_member_join(member):
    welcome_channel = client.get_channel(WELCOME_CHANNEL)
    welcome_message = f"Welcome {member.mention}! 🎉\n\nTo learn more about the project, please check the following channels:\n1. partychain-information (to see how to connect your wallet)\n2. announcements\n3. faq\n\nFeel free to ask any questions, and enjoy your stay! Together we make crypto great again!"
    await welcome_channel.send(welcome_message)

@client.event
async def on_member_update(before, after):
    if before.name != after.name or before.discriminator != after.discriminator:
        await check_name_similarity(after)

@tasks.loop(seconds=BACKOFF_TIME)
async def check_users():
    guild = None

    for g in client.guilds:
        if g.name == SERVER_NAME:
            guild = g
            break

    if not guild:
        print("Server not found.")
        return

    for member in guild.members:
        if any(role.name in ALLOWED_ROLES for role in member.roles):
            users_info[member.id] = f"{member.name}#{member.discriminator}"

    for member in guild.members:
        await check_name_similarity(member)

async def check_name_similarity(target_member):
    guild = target_member.guild
    for member in guild.members:
        for user_id, user_info in users_info.items():
            if user_id != member.id and user_info.lower() in f"{target_member.name}#{target_member.discriminator}".lower():
                channel = client.get_channel(NOTIFICATION_CHANNEL)

                if target_member.id in warning_list:
                    await channel.send(f"Found user with a similar name and discriminator: {target_member.mention}")
                    await target_member.send(f"Hey {target_member.mention}, you have been identified as a potential scammer because your name and discriminator resemble those of one of the known users. As a result, you will be banned from the server.")
                    await guild.ban(target_member, reason="Potential scammer with similar username and discriminator")
                else:
                    await channel.send(f"Found user with a similar name and discriminator: {target_member.mention}")
                    await target_member.send(f"Hey {target_member.mention}, you have been identified as a potential scammer because your name and discriminator resemble those of one of the known users. Please change your username to avoid being kicked from the server.")
                    warning_list[target_member.id] = True
                    await guild.kick(target_member, reason="Potential scammer with similar username and discriminator")
                break
check_users.before_loop(client.wait_until_ready)

client.run(TOKEN)
