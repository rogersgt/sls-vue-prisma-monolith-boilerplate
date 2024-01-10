import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppNav from '../AppNav.vue'

describe('AppNav', () => {
  it('renders properly', () => {
    const wrapper = mount(AppNav);
    expect(wrapper.isVisible());
  })
})
