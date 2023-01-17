task :deploy do |t|
  sh "git push origin main"
  sh "npm run build"
  sh "rsync -auP --exclude-from='rsync-exclude.txt' ./public $NEBYOOKEYS_REMOTE"
end

task :default => [:deploy]