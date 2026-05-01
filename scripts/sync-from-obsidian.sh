#!/bin/bash
# Sync blog posts from Obsidian Vault to content/posts/
# Only syncs .md/.mdx files from the "blogs" folder

VAULT_DIR="$HOME/Documents/Obsidian Vault/blogs"
BLOG_DIR="$HOME/Documents/personal-website/content/posts"

# Use rsync to sync (with --delete, Obsidian Vault is the source of truth)
rsync -av --delete \
  --exclude='.*' \
  --exclude='*.excalidraw.md' \
  "$VAULT_DIR/" "$BLOG_DIR/"

echo "Synced $(find "$BLOG_DIR" -name '*.md' -o -name '*.mdx' | wc -l | tr -d ' ') posts from Obsidian Vault"
