import { afterEach, describe, expect, it, vi } from 'vitest'


//image url
const imageurl = 'https://www.fakeimage.com'

//mock add image
function mockaddimage(image) {
  if (image === imageurl) {
    return true
  } else {
    return false
  }
}



//mocking the add image function
describe('pretending to add image', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return true if image is added', () => {

    expect(mockaddimage(imageurl)).toBe(true)
  })

  it('should return false if image is not added', () => {

    expect(mockaddimage('https://www.fakeimage1.com')).toBe(false)
  })
})



export default mockaddimage
