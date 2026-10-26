export const SUPPORTED_LANGUAGES = [
  {
    id: 'python',
    compiler: 'cpython-3.13.8',
    name: 'Python',
    version: '3.13',
    extension: 'py',
    boilerplate: `# Python
def solve():
    nums = [3, 1, 4, 1, 5, 9, 2, 6]
    print(f"Original: {nums}")
    print(f"Sorted:   {sorted(nums)}")
    print(f"Sum:      {sum(nums)}")

if __name__ == "__main__":
    print("⚡ Hello from Python!")
    solve()
`
  },
  {
    id: 'c++',
    compiler: 'gcc-13.2.0',
    name: 'C++',
    version: 'GCC 13.2',
    extension: 'cpp',
    boilerplate: `// C++
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "⚡ Hello from C++!" << std::endl;
    std::vector<int> nums = {10, 20, 30, 40, 50};
    int total = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "Sum of elements: " << total << std::endl;
    return 0;
}
`
  },
  {
    id: 'c',
    compiler: 'gcc-13.2.0-c',
    name: 'C',
    version: 'GCC 13.2',
    extension: 'c',
    boilerplate: `// C
#include <stdio.h>

int main() {
    printf("⚡ Hello from C!\\n");
    for (int i = 1; i <= 5; i++) {
        printf("Item #%d: Square = %d\\n", i, i * i);
    }
    return 0;
}
`
  },
  {
    id: 'java',
    compiler: 'openjdk-jdk-21+35',
    name: 'Java',
    version: 'JDK 21',
    extension: 'java',
    boilerplate: `// Java (Class name must be prog or Main)
public class prog {
    public static void main(String[] args) {
        System.out.println("⚡ Hello from Java!");
        int a = 15;
        int b = 27;
        System.out.println(a + " + " + b + " = " + (a + b));
    }
}
`
  },
  {
    id: 'javascript',
    compiler: 'nodejs-20.17.0',
    name: 'JavaScript (Node)',
    version: 'Node 20',
    extension: 'js',
    boilerplate: `// JavaScript (Node.js)
console.log("⚡ Hello from JavaScript!");

const data = [
  { name: "Sirjan", role: "Engineer" },
  { name: "Compiler", role: "Wandbox Sandbox" }
];

console.table(data);
`
  },
  {
    id: 'typescript',
    compiler: 'typescript-5.6.2',
    name: 'TypeScript',
    version: 'TS 5.6',
    extension: 'ts',
    boilerplate: `// TypeScript
interface Developer {
  name: string;
  languages: string[];
}

const dev: Developer = {
  name: "Sirjan Murmu",
  languages: ["Python", "JavaScript", "C++"]
};

console.log(\`⚡ Hello \${dev.name}! Skills: \${dev.languages.join(", ")}\`);
`
  },
  {
    id: 'go',
    compiler: 'go-1.23.2',
    name: 'Go',
    version: 'Go 1.23',
    extension: 'go',
    boilerplate: `// Go
package main

import "fmt"

func main() {
    fmt.Println("⚡ Hello from Go!")
    messages := []string{"Fast", "Concurrent", "Simple"}
    for idx, msg := range messages {
        fmt.Printf("%d: %s\\n", idx+1, msg)
    }
}
`
  },
  {
    id: 'rust',
    compiler: 'rust-1.82.0',
    name: 'Rust',
    version: 'Rust 1.82',
    extension: 'rs',
    boilerplate: `// Rust
fn main() {
    println!("⚡ Hello from Rust!");
    let nums = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = nums.iter().map(|&x| x * 2).collect();
    println!("Doubled: {:?}", doubled);
}
`
  },
  {
    id: 'bash',
    compiler: 'bash',
    name: 'Bash',
    version: 'Bash 5',
    extension: 'sh',
    boilerplate: `#!/bin/bash
echo "⚡ Hello from Bash Shell!"
echo "Current Date: $(date)"
echo "Kernel: $(uname -s -r)"
`
  }
];
