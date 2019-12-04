//
//  WebViewController.swift
//  cyberchess
//
//  Created by Roger Navarro on 11/27/19.
//  Copyright © 2019 Roger Navarro. All rights reserved.
//

import UIKit
import WebKit

class WebViewController: UIViewController {

    @IBOutlet weak var webview: WKWebView!
    var progressView: UIProgressView!
    @IBOutlet weak var loadingIndicator: UIActivityIndicatorView!
    var urlString: String!
    @IBOutlet weak var goBackButton: UIButton!
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .default
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = UIColor.white
        let link = URL(string:self.urlString)!
        let request = URLRequest(url: link)
        webview.configuration.userContentController.add(self, name: "callbackHandler")
        webview.load(request)
        webview.navigationDelegate = self
        self.preventZooming()
        loadingIndicator.color = UIColor.gray
    }
    
    @IBAction func goBack(_ sender: Any) {
        dismiss(animated: true, completion: nil)
    }
    
    func preventZooming() {
        let source: String = "var meta = document.createElement('meta');" +
            "meta.name = 'viewport';" +
            "meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';" +
            "var head = document.getElementsByTagName('head')[0];" + "head.appendChild(meta);";
        let script: WKUserScript = WKUserScript(source: source, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        webview.configuration.userContentController.addUserScript(script)
    }

}

extension WebViewController: WKScriptMessageHandler, WKNavigationDelegate {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if(message.name == "callbackHandler") {
            print("🟢Loggin Out")
            print("\(message.body)")
        }
        guard let exitType = message.body as? String else { return }
        switch exitType {
        case "log_out":
            dismiss(animated: true, completion: nil)
        case "dark_mode":
            self.view.backgroundColor = UIColor.init(red: 66/255, green: 66/255, blue: 66/255, alpha: 1)
            self.goBackButton.tintColor = UIColor.init(red: 1, green: 1, blue: 1, alpha: 1)
        case "light_mode":
            self.view.backgroundColor = UIColor.init(red: 1, green: 1, blue: 1, alpha: 1)
            self.goBackButton.tintColor = UIColor.init(red: 66/255, green: 66/255, blue: 66/255, alpha: 1)
        default:
            return
        }
    }
    
    func webView(_ webView: WKWebView, didCommit: WKNavigation!) {
        self.loadingIndicator.startAnimating()
    }
    
    func webView(_ webView: WKWebView, didFinish: WKNavigation!) {
        self.loadingIndicator.stopAnimating()
    }
}
