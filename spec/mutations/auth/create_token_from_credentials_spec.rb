require "spec_helper"

describe Auth::FromJwt do
  let(:user) { FactoryBot.create(:user) }

  def fake_credentials(email, password)
    # Input -> JSONify -> encrypt -> Base64ify
    secret = { email: email, password: password }.to_json
    ct = KeyGen.current.public_encrypt(secret)
    return Base64.encode64(ct)
  end

  it "rejects bad credentials" do
    results = Auth::CreateTokenFromCredentials
      .run(credentials: "FOO", fbos_version: Gem::Version.new("999.9.9"))
    expect(results.success?).to eq(false)
    expect(results.errors.message_list).to include(Auth::CreateTokenFromCredentials::BAD_KEY)
  end

  it "accepts good credentials" do
    pw = "password123"
    user = FactoryBot.create(:user, password: pw)
    email = user.email
    creds = fake_credentials(email, pw)
    results = Auth::CreateTokenFromCredentials
      .run!(credentials: creds, fbos_version: Gem::Version.new("999.9.9"))
    expect(results[:token]).to be_kind_of(SessionToken)
    expect(results[:user]).to eq(user)
  end

  it "Rejects bad email / password" do
    input = {
      email: "x@y.z",
      password: "password123",
      fbos_version: Gem::Version.new("17.0.0"),
    }
    x = Auth::CreateToken.run(input)
    expect(x.success?).to be false
    expect(x.errors["auth"]).to be
    expect(x.errors["auth"].message_list).to include("Bad email or password.")
  end
end
