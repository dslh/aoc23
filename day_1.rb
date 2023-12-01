#!/usr/bin/env ruby

def sum_lines(filename, &block)
  File.readlines(filename).map(&block).map { |digits| (digits.first + digits.last).to_i }.sum
end

DIGITS = {
  'one'   => '1',
  'two'   => '2',
  'three' => '3',
  'four'  => '4',
  'five'  => '5',
  'six'   => '6',
  'seven' => '7',
  'eight' => '8',
  'nine'  => '9'
}
DIGITS_RE = /(?=(#{DIGITS.keys.join('|')}|\d))/

def alpha_digits(line)
  line.scan(DIGITS_RE).flatten.map { |digit| DIGITS[digit] || digit }
end

puts 'PART 1:'
puts sum_lines('./input/1.test') { |line| line.scan(/\d/) }
puts sum_lines('./input/1.txt') { |line| line.scan(/\d/) }
puts 'PART 2:'
puts sum_lines('./input/1b.test') { |line| alpha_digits(line) }
puts sum_lines('./input/1.txt') { |line| alpha_digits(line) }
