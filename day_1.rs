use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() {
    let mut sum: u32 = 0;
    if let Ok(lines) = read_lines("./input/1.txt") {
        for line in lines {
            if let Ok(code) = line {
                sum += (first_digit(&code) * 10 + last_digit(&code)) as u32;
            }
        }
    }
    println!("{}", sum);
}

fn first_digit(line: &String) -> u8 {
    for c in line.chars() {
        if c > '0' && c <= '9' {
            return (c as u8) - ('0' as u8);
        }
    }

    return 0;
}

fn last_digit(line: &String) -> u8 {
    let rev = line.chars().rev().collect();
    return first_digit(&rev);
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where P: AsRef<Path>, {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
