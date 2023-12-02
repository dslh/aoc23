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

TEST_GAMES = File.readlines("./input/2.test").map { |line| Game.new(line) }
GAMES = File.readlines("./input/2.txt").map { |line| Game.new(line) }

def part_one(games)
  games.select(&:in_bounds?).map(&:id).sum
end

def part_two(games)
  games.map(&:power).sum
end

puts 'PART 1:'
puts part_one TEST_GAMES
puts part_one GAMES
puts 'PART 2:'
puts part_two TEST_GAMES
puts part_two GAMES
