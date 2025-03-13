Here's a quick and dirty setup;

1. Copy .env.example to .env
2. Fill in values according to comments
3. If on Pterodactyl, start the server
4. Else, run "npm install"
5. Then run "npm run start".

If using docker;

1. Open the docker-compose.yml file
2. Fill in the "environment" values accordingly
3. Run "docker compose up -d"

--- 

Once you've got the bot online, you've done half the work! WAHOO!

All thats left is the setup, which honestly isn't bad, don't worry.

First things first, let's set the logging channel. Use the "/config"
command to select a channel for everything to log out to to when
something happens. If you don't do this (not required), it will just
log to the console instead.

WAHOO you're done! You just seup the entire bot, congrats. Good luck
with your new friend!