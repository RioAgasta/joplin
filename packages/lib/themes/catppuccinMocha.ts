import { Theme } from './type';
import theme_dark from './dark';

const theme: Theme = {
	...theme_dark,

	backgroundColor: '#1e1e2e',
	backgroundColorTransparent: 'rgba(30, 30, 46, 0.9)',
	oddBackgroundColor: '#313244',
	color: '#cdd6f4', // For regular text
	colorError: '#f38ba8',
	colorWarn: '#fab387',
	colorFaded: '#6c7086', // For less important text;
	dividerColor: '#45475a',
	selectedColor: '#313244',
	urlColor: '#89b4fa',

	backgroundColor2: '#313244',
	color2: '#cdd6f4',
	selectedColor2: '#45475a',
	colorError2: '#fab387',

	backgroundColor3: '#181825',
	backgroundColorHover3: '#89b4fa70',
	color3: '#a6adc8',

	backgroundColor4: '#313244',
	color4: '#a6adc8',

	raisedBackgroundColor: '#313244',
	raisedColor: '#cdd6f4',

	warningBackgroundColor: '#fab38755',

	tableBackgroundColor: '#1e1e2e',
	codeBackgroundColor: '#1e1e2e',
	codeBorderColor: '#45475a',
	codeColor: '#cdd6f4',

	codeMirrorTheme: 'solarized dark',
	codeThemeCss: 'atom-one-dark-reasonable.css',
};

export default theme;
