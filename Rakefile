task :deploy do |t|
  sh "git push origin main"
  sh "npm run build"
  sh "rsync -auP --exclude-from='rsync-exclude.txt' ./dist/* $KEEBORD_REMOTE"
  sh "rsync -auP --exclude-from='rsync-exclude.txt' ./public/assets/sf2/* $KEEBORD_REMOTE/assets/sf2"
end

task :default => [:deploy]