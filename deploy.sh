#!/bin/bash
# Simple deployment script for element-plus-x demo

echo "🔨 Building library..."
cd "E:/ws/element-plus-x"
npm run build

echo "✓ Library built"
cd demo
npm run build

echo "🚀 Deploying to GitHub Pages..."
# Create gh-pages branch if it doesn't exist
git branch -D

echo "📦 Adding gh-pages..."
git add -f gh-pages
git subtree add --prefix=dist/ origin/gh-pages

echo "🚀 Pushing to gh-pages..."
git push origin `git subtree push --prefix=dist gh-pages`

echo "✨ Done! Demo deployed at:"
echo "https://LinuxSuRen.github.io/element-plus-x/"