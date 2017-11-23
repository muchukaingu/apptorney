//
//  String+Extensions.swift
//  apptorney
//
//  Created by Muchu Kaingu on 11/20/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

extension String{
    func convertHtml() -> NSMutableAttributedString{
        guard let data = data(using: .utf8) else { return NSMutableAttributedString() }
        do{
            return try NSMutableAttributedString(data: data, options: [NSAttributedString.DocumentReadingOptionKey.documentType:NSAttributedString.DocumentType.html, NSAttributedString.DocumentReadingOptionKey.characterEncoding: String.Encoding.utf8.rawValue], documentAttributes: nil)
        }catch{
            return NSMutableAttributedString()
        }
    }
}



