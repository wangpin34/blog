#!/bin/bash

while getopts t: flag; do
  case "${flag}" in
  t) topic=${OPTARG} ;;
  esac
done

friday=$(date -v+friday +"%Y/%m/%d")
title="$friday: $topic"

template=$(cat blog.weekly-note-template.md)

body=$(jq -r --arg template "$template" --arg title "$title" '{title: $title, body: $template}' blog.weekly-note-template.json)

curl -X POST \
  -H 'Content-Type: application/json' \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$body" \
  "${GITHUB_API_URL}/repos/$GITHUB_REPOSITORY/issues"
