const { test, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(helper.noBlogs)
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.oneBlogs)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is counted right', () => {
    const result = listHelper.totalLikes(helper.multipleBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog(helper.noBlogs)
    assert.strictEqual(result, null)
  })
  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(helper.oneBlogs)
    assert.deepStrictEqual(result, helper.oneBlogs[0])
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(helper.multipleBlogs)
    assert.deepStrictEqual(result, helper.multipleBlogs[2])
  })
})

describe('most blogs', () => {
  test('of an empty list is undefined', () => {
    const result = listHelper.mostBlogs(helper.noBlogs)
    assert.strictEqual(result, undefined)
  })
  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.mostBlogs(helper.oneBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(helper.multipleBlogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('of an empty list is undefined', () => {
    const result = listHelper.mostLikes(helper.noBlogs)
    assert.strictEqual(result, undefined)
  })
  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.mostLikes(helper.oneBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(helper.multipleBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})
