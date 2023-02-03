task :deploy do |t|
  sh "git push origin main"
  sh "npm run build"
  sh "rsync -auP --exclude-from='rsync-exclude.txt' ./dist/* $KEEBORD_REMOTE"
end

task :default => [:deploy]