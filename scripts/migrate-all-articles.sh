#!/bin/bash
#
# Batch migrate all legacy articles to React format
#
# Outputs all articles to stdout in TypeScript format for articles.ts
#

set -e

ARCHIVE_DIR="ARCHIVE/private_html/articles"
SCRIPT="scripts/migrate-article.js"

echo "/**"
echo " * Article Data - AUTO-MIGRATED FROM LEGACY EJS TEMPLATES"
echo " */"
echo ""
echo "import type { Article } from '@/types/article';"
echo "import { CATEGORIES } from './categories';"
echo ""
echo "export const SAMPLE_ARTICLES: readonly Article[] = ["

# Find all EJS files except the template
for file in "$ARCHIVE_DIR"/*.ejs; do
    basename=$(basename "$file")

    # Skip template file
    if [ "$basename" = "_TEMPLATE-ARTICLE.ejs" ]; then
        continue
    fi

    echo "  // Migrating: $basename" >&2
    node "$SCRIPT" "$file" || {
        echo "  // ERROR: Failed to migrate $basename" >&2
        continue
    }
done

echo "];"
echo ""
echo "// Article lookup helpers"
echo "export function getArticleById(id: string): Article | undefined {"
echo "  return SAMPLE_ARTICLES.find(article => article.id === id);"
echo "}"
echo ""
echo "export function getAllArticles(): readonly Article[] {"
echo "  return SAMPLE_ARTICLES;"
echo "}"
