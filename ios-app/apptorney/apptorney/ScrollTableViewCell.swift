//
//  ScrollTableViewCell.swift
//  apptorney
//
//  Created by Muchu Kaingu on 9/12/17.
//  Copyright © 2017 Muchu Kaingu. All rights reserved.
//

import UIKit
protocol ScrollTableViewCellDelegate {
    func tapped(selectedItem:HomeItem?)
}
class ScrollTableViewCell: UITableViewCell {
    var itemsToDisplay = [HomeItem]()
    var section:Int = 0
    var colors:[UIColor] = []
    @IBOutlet weak var collectionView:UICollectionView!
    var delegate: ScrollTableViewCellDelegate?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
}

extension ScrollTableViewCell: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        print(itemsToDisplay[indexPath.row].type)
        delegate?.tapped(selectedItem:itemsToDisplay[indexPath.row])
    }
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        print("Number of Items\(itemsToDisplay.count)")
        return itemsToDisplay.count//itemsToDisplay.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
//        colors.append(UIColor(red: 255.0/255, green: 46.0/255, blue: 99.0/255, alpha: 1.0)) //pinkish
//        colors.append(UIColor(red: 238.0/255, green: 98.0/255, blue: 100.0/255, alpha: 1.0)) //salmon
        colors.append(UIColor(hex:"ffffff"))
        colors.append(UIColor(hex:"ffffff"))
        colors.append(UIColor(hex:"ffffff"))
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "largeCell", for: indexPath) as! HomeLargeCollectionViewCell
        
        cell.name.text = itemsToDisplay[indexPath.row].title?.capitalized
        cell.summary.text = itemsToDisplay[indexPath.row].summary
        cell.backgroundColor = colors[section]
        if section == 1 {
            cell.name.font = cell.name.font.withSize(13)
            cell.accessoryImage.image = UIImage(named: "sunny")
            cell.bookmarkImage.alpha = 0
        }
        if section == 2 {
            cell.name.font = cell.name.font.withSize(13)
            cell.accessoryImage.image = UIImage(named: "trend")
            cell.bookmarkImage.alpha = 0
        }
        return cell
    }
}



extension ScrollTableViewCell : UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        var multiplier:CGFloat = 0.9
        if section == 1 {
            multiplier = 0.33
        }
        
        let hardCodedPadding:CGFloat = 10
        let itemWidth = collectionView.bounds.width * multiplier
        let itemHeight = collectionView.bounds.height - (2 * hardCodedPadding)
        return CGSize(width: itemWidth, height: itemHeight)
    }
}

extension ScrollTableViewCell : UIScrollViewDelegate, UICollectionViewDelegate
{
    func scrollViewWillEndDragging(_ scrollView: UIScrollView, withVelocity velocity: CGPoint, targetContentOffset: UnsafeMutablePointer<CGPoint>)
    {
        print("Yo! Yo!")
        let layout = self.collectionView.collectionViewLayout as! UICollectionViewFlowLayout
        let cellWidthIncludingSpacing = layout.itemSize.width + 65
       
        var offset = targetContentOffset.pointee
        
        let index = (offset.x + scrollView.contentInset.left) / cellWidthIncludingSpacing
        let roundedIndex = round(index)
        
        offset = CGPoint(x: roundedIndex * cellWidthIncludingSpacing - scrollView.contentInset.left, y: -scrollView.contentInset.top)
        print(offset)
        targetContentOffset.pointee = offset
    }
    
    
}
