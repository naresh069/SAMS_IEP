#!/usr/bin/env sh
set -eu

if [ -n "${DATABASE_URL:-}" ] && [ -z "${SPRING_DATASOURCE_URL:-}" ]; then
  case "$DATABASE_URL" in
    jdbc:*) export SPRING_DATASOURCE_URL="$DATABASE_URL" ;;
    postgresql://*)
      db_without_scheme="${DATABASE_URL#postgresql://}"
      db_host_path="${db_without_scheme#*@}"
      export SPRING_DATASOURCE_URL="jdbc:postgresql://$db_host_path"
      ;;
    postgres://*)
      db_without_scheme="${DATABASE_URL#postgres://}"
      db_host_path="${db_without_scheme#*@}"
      export SPRING_DATASOURCE_URL="jdbc:postgresql://$db_host_path"
      ;;
  esac
fi

exec java -jar app.jar
