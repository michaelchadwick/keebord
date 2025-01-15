task :deploy do |t|
  sh "git push origin main"
  sh "pnpm run build"
  sh "rsync -auP --no-p --exclude-from='rsync-exclude.txt' ./dist/* $KEEBORD_REMOTE"
  sh "rsync -auP --no-p --exclude-from='rsync-exclude.txt' ./public/assets/sf2/* $KEEBORD_REMOTE/assets/sf2"
end

task :default => [:deploy]