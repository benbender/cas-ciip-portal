import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import requireContext from 'require-context.macro';
import '../node_modules/bootstrap/dist/css/bootstrap.css'

addDecorator(withInfo);

// automatically import all files ending in *.stories.js
configure(requireContext('../tests', true, /\.stories\.tsx?$/), module);
