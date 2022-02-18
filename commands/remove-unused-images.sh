for FILE in $(git ls-files ./src/public/images); do
  git grep $(basename "$FILE") > /dev/null || git rm "$FILE"
done
