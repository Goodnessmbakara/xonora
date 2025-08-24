
import type { Config } from "tailwindcss";

// Note: This project uses Tailwind CSS 3.4.11 which supports <alpha-value> syntax
// in hsl(var(--token) / <alpha-value>) patterns for opacity utilities

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'xonora-dark': 'hsl(var(--xonora-dark) / <alpha-value>)',
				'xonora-primary': {
					DEFAULT: 'hsl(var(--xonora-primary-500) / <alpha-value>)',
					300: 'hsl(var(--xonora-primary-300) / <alpha-value>)',
					400: 'hsl(var(--xonora-primary-400) / <alpha-value>)',
					500: 'hsl(var(--xonora-primary-500) / <alpha-value>)',
					600: 'hsl(var(--xonora-primary-600) / <alpha-value>)',
					700: 'hsl(var(--xonora-primary-700) / <alpha-value>)'
				},
				'xonora-secondary': {
					DEFAULT: 'hsl(var(--xonora-secondary-500) / <alpha-value>)',
					300: 'hsl(var(--xonora-secondary-300) / <alpha-value>)',
					400: 'hsl(var(--xonora-secondary-400) / <alpha-value>)',
					500: 'hsl(var(--xonora-secondary-500) / <alpha-value>)',
					600: 'hsl(var(--xonora-secondary-600) / <alpha-value>)',
					700: 'hsl(var(--xonora-secondary-700) / <alpha-value>)'
				},
				'xonora-accent': {
					DEFAULT: 'hsl(var(--xonora-accent-500) / <alpha-value>)',
					300: 'hsl(var(--xonora-accent-300) / <alpha-value>)',
					400: 'hsl(var(--xonora-accent-400) / <alpha-value>)',
					500: 'hsl(var(--xonora-accent-500) / <alpha-value>)',
					600: 'hsl(var(--xonora-accent-600) / <alpha-value>)'
				},
				'xonora-light': 'hsl(var(--xonora-light) / <alpha-value>)',
				'xonora-warning': 'hsl(var(--xonora-warning) / <alpha-value>)',
				'surface-900': 'hsl(var(--surface-900) / <alpha-value>)',
				'success': 'hsl(var(--xonora-accent-400) / <alpha-value>)',
				'danger': 'hsl(var(--xonora-warning) / <alpha-value>)',
				'xonora-amber': {
					DEFAULT: 'hsl(var(--xonora-amber-500) / <alpha-value>)',
					400: 'hsl(var(--xonora-amber-400) / <alpha-value>)',
					500: 'hsl(var(--xonora-amber-500) / <alpha-value>)',
					600: 'hsl(var(--xonora-amber-600) / <alpha-value>)'
				},
				'xonora-cyan': {
					DEFAULT: 'hsl(var(--xonora-cyan-500) / <alpha-value>)',
					400: 'hsl(var(--xonora-cyan-400) / <alpha-value>)',
					500: 'hsl(var(--xonora-cyan-500) / <alpha-value>)',
					600: 'hsl(var(--xonora-cyan-600) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-up': {
					'0%': {
						transform: 'scale(1)'
					},
					'100%': {
						transform: 'scale(1.05)'
					}
				},
				'glow': {
					'0%, 100%': {
						'box-shadow': '0 0 20px hsl(var(--xonora-primary-500) / 0.3)'
					},
					'50%': {
						'box-shadow': '0 0 40px hsl(var(--xonora-primary-500) / 0.6)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-up': 'scale-up 0.2s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			fontFamily: {
				'tech': ['NeueHaasGrotDisp', 'system-ui', 'sans-serif'],
				'body': ['METROPOLIS', 'system-ui', 'sans-serif']
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'grid-pattern': 'linear-gradient(hsl(var(--xonora-primary-500) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--xonora-primary-500) / 0.1) 1px, transparent 1px)'
			},
			backgroundSize: {
				'grid': '20px 20px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
