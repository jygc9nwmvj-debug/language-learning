import AVFoundation
import Foundation
let synthesizer = AVSpeechSynthesizer()
let utterance = AVSpeechUtterance(string: CommandLine.arguments[1])
utterance.voice = AVSpeechSynthesisVoice(language: "zh-TW")
utterance.rate = Float(CommandLine.arguments[2])!
let url = URL(fileURLWithPath: CommandLine.arguments[3])
var file: AVAudioFile?
synthesizer.write(utterance) { buffer in
    guard let pcm = buffer as? AVAudioPCMBuffer else { return }
    if pcm.frameLength == 0 { file = nil; exit(0) }
    do {
        if file == nil { file = try AVAudioFile(forWriting: url, settings: pcm.format.settings) }
        try file!.write(from: pcm)
    } catch { print(error); exit(1) }
}
RunLoop.main.run()
