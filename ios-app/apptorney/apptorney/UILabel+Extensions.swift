//
//  UILabel+Extensions.swift
//  apptorney
//
//  Created by Muchu Kaingu on 11/20/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

extension UILabel {
    func setHTMLFromString(text: String) {
        let modifiedFont = NSString(format:"<style>strong {color:#000000}</style><span style=\"font-family: '-apple-system', 'HelveticaNeue-Bold'; font-size: \(self.font!.pointSize)\">%@</span>" as NSString, text)
        
        let attrStr = try! NSAttributedString(
            data: modifiedFont.data(using: String.Encoding.unicode.rawValue, allowLossyConversion: true)!,
            options: [NSAttributedString.DocumentReadingOptionKey.documentType:NSAttributedString.DocumentType.html, NSAttributedString.DocumentReadingOptionKey.characterEncoding: String.Encoding.utf8.rawValue],
            documentAttributes: nil)
        
        self.attributedText = attrStr
    }
    
    func setHTMLFromStringForLightText(text: String) {
        let modifiedFont = NSString(format:"<style>strong {color:#000000}</style><span style=\"font-family: '-apple-system', 'HelveticaNeue-Light'; font-size: 11pt; color:#494949 \">%@</span>" as NSString, text)
        
        let attrStr = try! NSAttributedString(
            data: modifiedFont.data(using: String.Encoding.unicode.rawValue, allowLossyConversion: true)!,
            options: [NSAttributedString.DocumentReadingOptionKey.documentType:NSAttributedString.DocumentType.html, NSAttributedString.DocumentReadingOptionKey.characterEncoding: String.Encoding.utf8.rawValue],
            documentAttributes: nil)
        
        self.attributedText = attrStr
    }
    
    func calculateMaxLines() -> Double {
        let maxSize = CGSize(width: frame.size.width, height: CGFloat(Float.infinity))
        let charSize = font.lineHeight
        let text = (self.text ?? "") as NSString
        let textSize = text.boundingRect(with: maxSize, options: .usesLineFragmentOrigin, attributes: [.font: font], context: nil)
        let lines = Int(textSize.height/charSize)
        return Double(lines)
    }
}

//orange highlight = f3a435
