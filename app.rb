# app.rb
require 'sinatra'


class ExampleApp < Sinatra::Base
  get '/' do
    "Hello Team B!"
  end
end
