import { afterEach, describe, expect, it, vi } from 'vitest'


//fake login
function fakelogin(username, password) {
  if (username === 'admin' && password === 'admin') {
    return true
  } else {
    return false
  }
}

// Mocking the login function
describe('pretending to login', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return true if username and password are admin', () => {

    expect(fakelogin('admin', 'admin')).toBe(true)
  })

  it('should return false if username and password are not admin', () => {

    expect(fakelogin('admin', 'admin1')).toBe(false)
  })
})

export default fakelogin
