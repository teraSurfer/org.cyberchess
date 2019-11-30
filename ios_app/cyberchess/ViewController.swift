//
//  ViewController.swift
//  cyberchess
//
//  Created by Roger Navarro on 11/26/19.
//  Copyright © 2019 Roger Navarro. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    //MARK: - Properties
    var emitter = CAEmitterLayer()

    //MARK: - View Life Cycle
    override var preferredStatusBarStyle: UIStatusBarStyle {
      return .darkContent
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        print("I got here")
    }
    
    override func viewDidAppear(_ animated: Bool) {
        animateImagesInTheBrackgroud()
    }
    
    @IBAction func loginAsUser(_ sender: UIButton) {
        performSegue(withIdentifier: "User", sender: nil)
    }
    
    @IBAction func loginAsInstructor(_ sender: UIButton) {
        performSegue(withIdentifier: "Instructor", sender: nil)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let viewController = segue.destination as! WebViewController
        switch segue.identifier {
        case "User":
//            viewController.urlString = "http://192.168.130.171:8081"
            viewController.urlString = "https://app.cyberchess.org"
        case "Instructor":
//            viewController.urlString = "http://192.168.130.171:8080"
            viewController.urlString = "https://admin.cyberchess.org"
        default:
            return
        }
    }
    
    
    
    
}

// MARK: - Animations
extension ViewController {
    fileprivate func animateImagesInTheBrackgroud() {
        let rect = CGRect(x: 0.0, y: -150.0, width: view.bounds.width, height: 150)
        emitter.frame = rect
        self.view.layer.sublayers?.insert(emitter, at: 0)
        emitter.emitterShape = CAEmitterLayerEmitterShape.rectangle
        emitter.emitterPosition = CGPoint(x: rect.width/2, y: rect.height/2)
        emitter.emitterSize = rect.size
        emitter.renderMode = CAEmitterLayerRenderMode.backToFront
        
        let labEmitterCell = CAEmitterCell()
        labEmitterCell.contents = UIImage(named: "bishop_rain_160")!.cgImage
        labEmitterCell.birthRate = 2
        labEmitterCell.lifetime = 15
        labEmitterCell.scale = 0.1
        labEmitterCell.yAcceleration = 20.0
        
        let activePrincipleEmitterCell = CAEmitterCell()
        activePrincipleEmitterCell.contents = UIImage(named: "knightrain_160")!.cgImage
        activePrincipleEmitterCell.birthRate = 2
        activePrincipleEmitterCell.lifetime = 15
        activePrincipleEmitterCell.scale = 0.1
        activePrincipleEmitterCell.yAcceleration = 20.0
        
        let historyEmitterCell = CAEmitterCell()
        historyEmitterCell.contents = UIImage(named: "pawn_rain_160")!.cgImage
        historyEmitterCell.birthRate = 2
        historyEmitterCell.lifetime = 15
        historyEmitterCell.scale = 0.1
        historyEmitterCell.yAcceleration = 20.0
        
        let productEmitterCell = CAEmitterCell()
        productEmitterCell.contents = UIImage(named: "rook_rain_160")!.cgImage
        productEmitterCell.birthRate = 2
        productEmitterCell.lifetime = 15
        productEmitterCell.scale = 0.1
        productEmitterCell.yAcceleration = 20.0
        
        emitter.emitterCells = [labEmitterCell,
                                activePrincipleEmitterCell,
                                historyEmitterCell,
                                productEmitterCell]
    }
}


