//
//  HeaderView.swift
//  TableViewWithMultipleCellTypes
//
//  Created by Stanislav Ostrovskiy on 5/21/17.
//  Copyright © 2017 Stanislav Ostrovskiy. All rights reserved.
//

import UIKit

protocol HeaderViewDelegate: class {
    func toggleSection(header: HeaderView, section: Int)
}

class HeaderView: UITableViewHeaderFooterView {

    var section: Section? {
        didSet {
            guard let section = section else {
                return
            }
            let attrStr = NSMutableAttributedString(string: section.name)
            
            if section.highlighted! {
                attrStr.addAttribute(NSAttributedStringKey.underlineStyle , value: NSUnderlineStyle.styleSingle.rawValue, range:NSMakeRange(0, attrStr.length))
                attrStr.addAttribute(NSAttributedStringKey.underlineColor , value: UIColor(hex: "f3a435"), range:NSMakeRange(0, attrStr.length))
            }
            titleLabel?.attributedText = attrStr
            //titleLabel?.textColor = section.highlighted! ? UIColor(hex: "f3a435"):UIColor.black
            setCollapsed(collapsed: section.isCollapsed)
            arrowLabel?.isHidden = !section.isCollapsible!
        }
    }
    
    @IBOutlet weak var titleLabel: UILabel?
    @IBOutlet weak var arrowLabel: UILabel?
    var sectionID: Int = 0
    
    weak var delegate: HeaderViewDelegate?
    
    static var nib:UINib {
        return UINib(nibName: identifier, bundle: nil)
    }
    
    static var identifier: String {
        return String(describing: self)
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(didTapHeader)))
    }
    
    @objc private func didTapHeader() {
        delegate?.toggleSection(header: self, section: sectionID)
    }

    func setCollapsed(collapsed: Bool) {
        arrowLabel?.rotate(collapsed ? 0.0 : .pi)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        self.textLabel?.textColor = UIColor.darkText
        self.contentView.backgroundColor = UIColor.white
    }
}


extension UIView {
    func rotate(_ toValue: CGFloat, duration: CFTimeInterval = 0.2) {
        let animation = CABasicAnimation(keyPath: "transform.rotation")
        
        animation.toValue = toValue
        animation.duration = duration
        animation.isRemovedOnCompletion = false
        animation.fillMode = kCAFillModeForwards
        
        self.layer.add(animation, forKey: nil)
    }
}
