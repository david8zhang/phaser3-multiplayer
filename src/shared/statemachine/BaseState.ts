export default abstract class BaseState {
  abstract onEnter()
  abstract onUpdate(dt: number)
  abstract onExit()
}
