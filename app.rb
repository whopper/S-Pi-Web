# app.rb
require 'sinatra'


class ExampleApp < Sinatra::Base
  set :public_folder, File.dirname(__FILE__) + '/bower_components'
  set :static, true

end
