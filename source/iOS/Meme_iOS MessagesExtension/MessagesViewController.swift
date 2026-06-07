//
//  MessagesViewController.swift
//  Meme_iOS MessagesExtension
//
import UIKit
import WebKit
import Messages

class MessagesViewController: MSMessagesAppViewController {
    
    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let webConfiguration = WKWebViewConfiguration()
        
        webView = WKWebView(frame: self.view.bounds, configuration: webConfiguration)
        
        // auto resize
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        self.view.addSubview(webView)
        
        //replace imgflip url to our project url once available
        if let url = URL(string: "https://imgflip.com") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
    
    /// This method catches layout transitions when the user expands the iMessage app
    /// from the compact view to the full-screen view (and vice versa).
    override func willTransition(to presentationStyle: MSMessagesAppPresentationStyle) {
        super.willTransition(to: presentationStyle)

        // Force the web view to perfectly recalculate and snap to the new layout boundaries
        guard let webView = webView else { return }
        webView.frame = self.view.bounds
    }
}
