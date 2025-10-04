class Devkatacli < Formula
  desc "Master dev habits, one kata at a time"
  homepage "https://github.com/fern-d3v/devKataCLI"
  url "https://registry.npmjs.org/devkatacli/-/devkatacli-1.0.0.tgz"
  sha256 "" # Will be filled after first npm publish
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/devkata", "--help"
  end
end
