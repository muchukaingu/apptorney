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
                //attributedText.addAttribute(NSAttributedString.Key.backgroundColor, value: UIColor.black, range: NSRange(location: 0, length: attributedText.length)
                attributedText.addAttribute(NSAttributedString.Key.backgroundColor, value: color, range: NSRange(location: 0, length: attributedText.length))
                attributedText.addAttribute(NSAttributedString.Key.foregroundColor, value: UIColor.white, range: NSRange(location: 0, length: attributedText.length))
                attributedText.addAttribute(NSAttributedString.Key.font, value: UIFont(name: "HelveticaNeue-Light", size: 16.2), range: NSRange(location: 0, length: attributedText.length))
                self.replaceCharacters(in: match.range, with: attributedText)
            }
            matchesFound = matchesArray.count > 0 ? 1:0
        }
       
        return (self, matchesFound)
    }
    
    func removeSpaces() -> NSMutableAttributedString {
        //let regPattern = "\\n(?=[a-z])"
        let regPattern = "\\{\\s\\}" //hack to remove ghostly curly braces that appear when users searches
        var matchesFound = 0
        if let regex = try? NSRegularExpression(pattern: regPattern, options: []) {
            let matchesArray = regex.matches(in: self.string, options: [], range: NSRange(location: 0, length: self.length))
            for match in matchesArray {
                let attributedText = NSMutableAttributedString(string: regPattern)
                //attributedText.addAttribute(NSAttributedString.Key.backgroundColor, value: UIColor.black, range: NSRange(location: 0, length: attributedText.length))
                //attributedText.addAttribute(NSAttributedString.Key.foregroundColor, value: color, range: NSRange(location: 0, length: attributedText.length))
                self.replaceCharacters(in: match.range, with: " ")
                
            }
            matchesFound = matchesArray.count > 0 ? 1:0
        }
        
        return self
    }
    
    
    /*func makeHeadingsBold() -> NSMutableAttributedString {
       return self
    }*/
    
    
    func setHTMLFromString(text: String, target: String, color: UIColor) -> (NSMutableAttributedString, Int){
        let attributedText = NSMutableAttributedString(string: text)
        
        let modifiedFont = NSString(format:"<style>h1 {font-size:1.0em; font-weight:600}</style><span style=\"font-family: 'HelveticaNeue-Light'; font-size: 12pt \">%@</span>" as NSString, attributedText)
        
        var attrStr = try! NSMutableAttributedString(
            data: modifiedFont.data(using: String.Encoding.unicode.rawValue, allowLossyConversion: true)!,
            options: [NSAttributedString.DocumentReadingOptionKey.documentType:NSAttributedString.DocumentType.html, NSAttributedString.DocumentReadingOptionKey.characterEncoding: String.Encoding.utf8.rawValue],
            documentAttributes: nil)
        
        
         let textInArray = [target.capitalized, target.lowercased(), target.uppercased()]
         var count = 0
         for text in textInArray {
            let result = attrStr.highlightTarget(target: text, color: color)
            attrStr = result.0
            if result.1 == 1 {
                count = count+1
            }
         }
        
         //let highlighted = count > 0 ? true:false
        attrStr = attrStr.removeSpaces() //hack to remove ghostly curly braces that appear when users searches
        return (attrStr, count)
    }
    
    

}
