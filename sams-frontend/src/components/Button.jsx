import { classNames } from '../utils/helpers.js'
export default function Button({ variant = 'primary', className = '', ...props }) {
  const map = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    danger: 'btn-danger',
  }
  return <button className={classNames(map[variant], className)} {...props} />
}
