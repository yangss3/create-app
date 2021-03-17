export default () => (name: string) => {
  if(name.startsWith('Van')) {
    const compDir = name[3].toLowerCase() + name.slice(4).replace(/[A-Z]/g, s => `-${s.toLowerCase()}`)
    return {
      path: `vant/es/${compDir}`,
      sideEffects: `vant/es/${compDir}/style/index.js`
    }
  }
}