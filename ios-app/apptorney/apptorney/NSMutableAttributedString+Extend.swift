//
//  NSMutableAttributedString+Extend.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/15/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

extension NSMutableAttributedString {
    
    func highlightTarget(target: String, color: UIColor) -> (NSMutableAttributedString, Int) {
        let regPattern = target
        var matchesFound = 0
        if let regex = try? NSRegularExpression(pattern: regPattern, options: []) {
            let matchesArray = regex.matches(in: self.string, options: [], range: NSRange(location: 0, length: self.length))
            for match in matchesArray {
                let attributedText = NSMutableAttributedString(string: target)
                //attributedText.addAttribute(NSAttributedStringKey.backgroundColor, value: UIColor.black, range: NSRange(location: 0, length: attributedText.length))
                attributedText.addAttribute(NSAttributedStringKey.foregroundColor, value: color, range: NSRange(location: 0, length: attributedText.length))
                self.replaceCharacters(in: match.range, with: attributedText)
            }
            matchesFound = matchesArray.count > 0 ? 1:0
        }
       
        return (self, matchesFound)
    }
    
    func removeSpaces() -> NSMutableAttributedString {
        let regPattern = "\\n(?=[a-z])"
        var matchesFound = 0
        if let regex = try? NSRegularExpression(pattern: regPattern, options: []) {
            let matchesArray = regex.matches(in: self.string, options: [], range: NSRange(location: 0, length: self.length))
            for match in matchesArray {
                let attributedText = NSMutableAttributedString(string: regPattern)
                //attributedText.addAttribute(NSAttributedStringKey.backgroundColor, value: UIColor.black, range: NSRange(location: 0, length: attributedText.length))
                //attributedText.addAttribute(NSAttributedStringKey.foregroundColor, value: color, range: NSRange(location: 0, length: attributedText.length))
                self.replaceCharacters(in: match.range, with: " ")
                print("match \(match)")
            }
            matchesFound = matchesArray.count > 0 ? 1:0
        }
        
        return self
    }
    
    
    func makeHeadingsBold() -> NSMutableAttributedString {
        let regPattern = "<strong>(.*)</strong>"
        if let regex = try? NSRegularExpression(pattern: regPattern, options: []) {
            let matchesArray = regex.matches(in: self.string, options: [], range: NSRange(location: 0, length: self.length))
            for match in matchesArray {
                let attributedText = NSMutableAttributedString(string: regPattern)
                //attributedText.addAttribute(NSAttributedStringKey.backgroundColor, value: UIColor.black, range: NSRange(location: 0, length: attributedText.length))
                attributedText.addAttribute(NSAttributedStringKey.font, value:  UIFont.boldSystemFont(ofSize: 15), range: NSRange(location: 0, length: attributedText.length))
                self.replaceCharacters(in: match.range, with: attributedText)
                print("match \(match)")
            }
            
        }
        
        return self
    }
}
