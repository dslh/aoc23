#!/usr/bin/env ruby

def calibration_value(lines)
  lines.map do |line|
    digits = line.scan(/\d/)
    (digits.first + digits.last).to_i
  end.sum
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

def alpha_calibration_value(lines)
  lines.map do |line|
    digits = line.scan(DIGITS_RE).flatten.map { |digit| DIGITS[digit] || digit }
    (digits.first + digits.last).to_i
  end.sum
end

puts 'PART 1:'
puts calibration_value File.readlines('./input/1.test')
puts calibration_value File.readlines('./input/1.txt')
puts 'PART 2:'
puts alpha_calibration_value File.readlines('./input/1b.test')
puts alpha_calibration_value File.readlines('./input/1.txt')
