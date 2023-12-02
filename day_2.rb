#!/usr/bin/env ruby

COLOURS = %w[red green blue]

UPPER_BOUNDS = {
  red:   12,
  green: 13,
  blue:  14
}

class Game
  def initialize(line)
    id, hands = line.split(': ')
    @id = id.split(' ').last.to_i
    @hands = hands.split('; ').map { |hand| Hand.new hand }
  end

  attr_reader :id, :hands

  def max(colour)
    hands.map(&colour).max
  end

  def in_bounds?
    UPPER_BOUNDS.all? { |colour, limit| max(colour) <= limit }
  end

  def power
    max(:red) * max(:green) * max(:blue)
  end
end

class Hand
  def initialize(hand)
    @red = @green = @blue = 0

    hand.split(', ').each do |draw|
      amount, colour = draw.split(' ')

      send("#{colour}=", amount.to_i)
    end
  end

  attr_accessor :red, :green, :blue
end

def part_one(type = 'txt')
  games = File.readlines("./input/2.#{type}").map { |line| Game.new(line) }
  games.select(&:in_bounds?).map(&:id).sum
end

def part_two(type = 'txt')
  games = File.readlines("./input/2.#{type}").map { |line| Game.new(line) }
  games.map(&:power).sum
end

puts 'PART 1:'
puts part_one('test')
puts part_one
puts 'PART 2:'
puts part_two('test')
puts part_two
