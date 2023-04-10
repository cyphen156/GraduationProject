import { StyleSheet } from 'react-native';

export const neutral = {
    100: '#FFFFFF',
    600: '#939393',
    700: '#707070',
    800: '#656565',
    900: '#0D0D0D',
};

export const theme = {
    100: '#FFFFFF',
    200: '#AFB4BB',
    400: '#6B717E',
    600: '#2f3542',
    700: '#2A303C',
    800: '#21252F',
    900: '#191D24',
}

export const accent = {
    100: '#E7BB41',
    200: '#E79241',
    300: '#ffd0a3'
}

export const background = {
    neutral: StyleSheet.create({
        100: {
            backgroundColor: neutral[100]
        },
        600: {
            backgroundColor: neutral[600]
        },
        700: {
            backgroundColor: neutral[700]
        },
        800: {
            backgroundColor: neutral[800]
        },
        900: {
            backgroundColor: neutral[900]
        },
    }),
    theme: StyleSheet.create({
        100: {
            backgroundColor: theme[100]
        },
        200: {
            backgroundColor: theme[200]
        },
        400: {
            backgroundColor: theme[400]
        },
        600: {
            backgroundColor: theme[600]
        },
        700: {
            backgroundColor: theme[700]
        },
        800: {
            backgroundColor: theme[800]
        },
        900: {
            backgroundColor: theme[900]
        },
    }),
    accent: StyleSheet.create({
        100: {
            backgroundColor: accent[100]
        },
        200: {
            backgroundColor: accent[200]
        },
        300: {
            color: accent[300]
        },
    }),
}

export const text = {
    neutral: StyleSheet.create({
        100: {
            color: neutral[100]
        },
        600: {
            color: neutral[600]
        },
        700: {
            color: neutral[700]
        },
        800: {
            color: neutral[800]
        },
        900: {
            color: neutral[900]
        },
    }),
    theme: StyleSheet.create({
        100: {
            color: theme[100]
        },
        200: {
            color: theme[200]
        },
        400: {
            color: theme[400]
        },
        600: {
            color: theme[600]
        },
        700: {
            color: theme[700]
        },
        800: {
            color: theme[800]
        },
        900: {
            color: theme[900]
        },
    }),
    accent: StyleSheet.create({
        100: {
            color: accent[100]
        },
        200: {
            color: accent[200]
        },
        300: {
            color: accent[300]
        },
    }),
}