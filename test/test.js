const Streamtopia = artifacts.require('./Streamtopia.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Streamtopia', ([deployer, author]) => {
  let streamtopia

  before(async () => {
    streamtopia = await Streamtopia.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await streamtopia.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await streamtopia.name()
      assert.equal(name, 'Streamtopia')
    })
  })

  describe('videos', async () => {
    let result, videoCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await streamtopia.uploadVideo(hash, 'Video title', { from: author })
      videoCount = await streamtopia.videoCount()
    })

    //check event
    it('creates videos', async () => {
      // SUCCESS
      assert.equal(videoCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'Video title', 'title is correct')
      assert.equal(event.author, author, 'author is correct')

      // FAILURE: Video must have hash
      await streamtopia.uploadVideo('', 'Video title', { from: author }).should.be.rejected;

      // FAILURE: Video must have title
      await streamtopia.uploadVideo('Video hash', '', { from: author }).should.be.rejected;
    })

    //check from Struct
    it('lists videos', async () => {
      const video = await streamtopia.videos(videoCount)
      assert.equal(video.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(video.hash, hash, 'Hash is correct')
      assert.equal(video.title, 'Video title', 'title is correct')
      assert.equal(video.author, author, 'author is correct')
    })
  })
})