
#!/bin/sh
if [ "$APP_NAME" = "stores-api" ]; then
  yarn heroku:stores-api:build
else
  echo "no special postbuild action found"
  exit 1
fi