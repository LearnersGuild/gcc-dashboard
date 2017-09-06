// this is pretty weak, but at least makes things _usable_ on mobile

/* global window */
const windowWidth = typeof window === 'undefined' ? 900 : window.innerWidth

export default () => {
  const maxWidthPct = Number(windowWidth) > 864 ? 32 : 100

  return {
    maxWidth: `${maxWidthPct}%`,
    display: 'inline-block',
    marginRight: '1%',
    marginTop: '1em',
    verticalAlign: 'top',
  }
}
