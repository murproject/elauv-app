import Blockly from 'blockly'

var CustomRenderer = function (name) {
  CustomRenderer.superClass_.constructor.call(this, name)
}

Blockly.utils.object.inherits(CustomRenderer, Blockly.thrasos.Renderer)

Blockly.blockRendering.register('custom_renderer', CustomRenderer)

var CustomConstantsProvider = function () {
  // Set up all of the constants from the base provider.
  CustomConstantsProvider.superClass_.constructor.call(this)

  this.NOTCH_WIDTH = 15
  this.NOTCH_HEIGHT = 5
  this.NOTCH_OFFSET_LEFT = 18.8

  // this.EXTERNAL_VALUE_INPUT_PADDING = 200
  // this.EMPTY_INLINE_INPUT_HEIGHT = 200
  // this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = 200
  // this.STATEMENT_INPUT_NOTCH_OFFSET

  this.CORNER_RADIUS = 0
  this.TAB_WIDTH = 5
  this.TAB_HEIGHT = 28 / 2

  // this.EMPTY_INLINE_INPUT_PADDING = 200
  this.EXTERNAL_VALUE_INPUT_PADDING = 10

  this.DUMMY_INPUT_MIN_HEIGHT = this.TAB_HEIGHT * 1.5
  this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = this.TAB_HEIGHT
  this.EMPTY_INLINE_INPUT_HEIGHT = this.TAB_HEIGHT * 1.75

  this.TAB_OFFSET_FROM_TOP = 5
  // this.TAB_VERTICAL_OVERLAP = 800

  this.RECT_PREV_NEXT = this.makeRectangularPreviousConn()
  this.RECT_INPUT_OUTPUT = this.makeRectangularInputConn()
}

Blockly.utils.object.inherits(CustomConstantsProvider,
  Blockly.blockRendering.ConstantProvider)

CustomRenderer.prototype.makeConstants_ = function () {
  return new CustomConstantsProvider()
}

CustomConstantsProvider.prototype.makeRectangularInputConn = function (e) {
  var width = this.TAB_WIDTH
  var height = this.TAB_HEIGHT

  function makeMainPath(up) {
    return Blockly.utils.svgPaths.line(
      [
        Blockly.utils.svgPaths.point(-width, -1 * up * (height / 2)),
        Blockly.utils.svgPaths.point(width, -1 * up * (height / 2))

        // Blockly.utils.svgPaths.point(-width / 2, 0),
        // Blockly.utils.svgPaths.point(-width, -1 * up * (height / 2)),
        // Blockly.utils.svgPaths.point(width, -1 * up * (height / 2)),
        // Blockly.utils.svgPaths.point(width / 2, 0)

        // Blockly.utils.svgPaths.point(-width, -1 * up * (height / 2)),
        // Blockly.utils.svgPaths.point(width, -1 * up * (height / 2))
      ])
  }

  var pathUp = makeMainPath(1)
  var pathDown = makeMainPath(-1)

  return {
    width: width,
    height: height,
    pathDown: pathDown,
    pathUp: pathUp
  }
}

CustomConstantsProvider.prototype.makeRectangularPreviousConn = function () {
  var width = this.NOTCH_WIDTH
  var height = this.NOTCH_HEIGHT

  /**
   * Since previous and next connections share the same shape
   * you can define a function to generate the path for both.
   */
  function makeMainPath(dir) {
    return Blockly.utils.svgPaths.line(
      [
        // Blockly.utils.svgPaths.point(0, height),
        // Blockly.utils.svgPaths.point(dir * width, 0),
        // Blockly.utils.svgPaths.point(0, -height)
        Blockly.utils.svgPaths.point(dir * width / 2, height),
        // Blockly.utils.svgPaths.point(dir * width, 0),
        Blockly.utils.svgPaths.point(dir * width / 2, -height)
      ])
  }
  var pathLeft = makeMainPath(1)
  var pathRight = makeMainPath(-1)

  return {
    width: width,
    height: height,
    pathLeft: pathLeft,
    pathRight: pathRight
  }
}

CustomConstantsProvider.prototype.shapeFor = function (
  connection) {
  switch (connection.type) {
    case Blockly.INPUT_VALUE:
    case Blockly.OUTPUT_VALUE:
      return this.RECT_INPUT_OUTPUT
    case Blockly.PREVIOUS_STATEMENT:
    case Blockly.NEXT_STATEMENT:
      return this.RECT_PREV_NEXT
    default:
      throw Error('Unknown connection type')
  }
}

// TODO: replace prompt dialogs - https://developers.google.com/blockly/reference/js/Blockly.dialog?hl=en
