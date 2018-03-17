//
//  NSMutableAttributedString+Extend.swift
//  apptorney
//
//  Created by Muchu Kaingu on 3/15/18.
//  Copyright © 2018 Muchu Kaingu. All rights reserved.
//

import UIKit

extension NSMutableAttributedString {
    
    func highlightTarget(target: String, color: UIColor) -> NSMutableAttributedString {
        let regPattern = target
        var matchesFound = 0
        if let regex = try? NSRegularExpression(pattern: regPattern, options: []) {
            let matchesArray = regex.matches(in: self.string, options: [], range: NSRange(location: 0, length: self.length))
            for match in matchesArray {
                let attributedText = NSMutableAttributedString(string: target)
                //attributedText.addAttribute(NSAttributedStringKey.backgroundColor, value: UIColor.black, range: NSRange(location: 0, length: attributedText.length)
                attributedText.addAttribute(NSAttributedStringKey.foregroundColor, value: color, range: NSRange(location: 0, length: attributedText.length))
                attributedText.addAttribute(NSAttributedStringKey.font, value: UIFont(name: "HelveticaNeue-Light", size: 13.5), range: NSRange(location: 0, length: attributedText.length))
                self.replaceCharacters(in: match.range, with: attributedText)
            }
            matchesFound = matchesArray.count > 0 ? 1:0
        }
       
        return self
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
    
    
    /*func makeHeadingsBold() -> NSMutableAttributedString {
       return self
    }*/
    
    
    func setHTMLFromString(text: String, target: String, color: UIColor) -> NSMutableAttributedString{
        var attributedText = NSMutableAttributedString(string: text).removeSpaces()
        
        let modifiedFont = NSString(format:"<style>h1 {font-size:1.0em; font-weight:600}</style><span style=\"font-family: 'HelveticaNeue-Light'; font-size: 10pt \">%@</span>" as NSString, attributedText)
        
        let attrStr = try! NSMutableAttributedString(
            data: modifiedFont.data(using: String.Encoding.unicode.rawValue, allowLossyConversion: true)!,
            options: [NSAttributedString.DocumentReadingOptionKey.documentType:NSAttributedString.DocumentType.html, NSAttributedString.DocumentReadingOptionKey.characterEncoding: String.Encoding.utf8.rawValue],
            documentAttributes: nil)
        
        return attrStr.highlightTarget(target: target, color:color)
    }
}
