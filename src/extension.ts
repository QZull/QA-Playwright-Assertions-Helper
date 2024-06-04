import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Основная команда для генерации шаблона Playwright
    let disposable = vscode.commands.registerCommand('extension.generatePlaywrightTemplate', async () => {
        const templateType = await vscode.window.showQuickPick(
            [
                'toBeVisible | Проверка видимости элементов',
                'toHaveCount | Проверка количества элементов',
                'toHaveCSS | Проверка CSS-свойств элементов',
                'toHaveText | Проверка текста элементов',
                'toHaveAttribute | Проверка атрибута элементов',
                'toHaveValue | Проверка значения элементов',
                'toHaveValues | Проверка значений элементов',
                'toBeEnabled | Проверка, что элементы включены',
                'toBeDisabled | Проверка, что элементы отключены',
                'toBeChecked | Проверка, что элементы отмечены',
                'toBeAttached | Проверка, что элементы прикреплены',
                'toBeEditable | Проверка, что элементы редактируемы',
                'toBeEmpty | Проверка, что элементы пустые',
                'toBeFocused | Проверка, что элементы сфокусированы',
                'toBeHidden | Проверка, что элементы скрыты',
                'toBeInViewport | Проверка, что элементы находятся в области видимости',
                'toContainText | Проверка содержимого текста элементов',
                'toHaveClass | Проверка класса элементов',
                'toHaveId | Проверка идентификатора элементов',
                'toHaveJSProperty | Проверка JS-свойства элементов',
                'toHaveScreenshot | Проверка скриншота элементов',
                'toHaveScreenshot(name) | Проверка скриншота элементов с именем',
                '(v.1.44) toHaveAccessibleDescription | Проверка доступного описания элементов',
                '(v.1.44) toHaveAccessibleName | Проверка доступного имени элементов',
                '(v.1.44) toHaveRole | Проверка роли элементов',
            ],
            {
                placeHolder: 'Выберите тип проверки',
            },
        );

        if (!templateType) {
            return;
        }

        const numLinesInput = await vscode.window.showInputBox({
            placeHolder: 'Введите нужное количество строк (например, 4)',
            validateInput: (value) => {
                if (!value) {
                    return null;
                }
                const parsed = parseInt(value);
                return isNaN(parsed) || parsed <= 0 ? 'Введите корректное число' : null;
            },
        });

        const numLines = numLinesInput ? parseInt(numLinesInput) : 1;

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const template = generateTemplate(templateType, numLines);
            editor.edit((editBuilder) => {
                editBuilder.insert(editor.selection.active, template);
            });
        }
    });

    context.subscriptions.push(disposable);

    // Объект для хранения соответствия между названиями функций и URL-адресами
    const functionUrls: { [key: string]: string } = {
        'toBeVisible | Проверка видимости элементов': '#locator-assertions-to-be-visible',
        'toHaveCount | Проверка количества элементов': '#locator-assertions-to-have-count',
        'toHaveCSS | Проверка CSS-свойств элементов': '#locator-assertions-to-have-css',
        'toHaveText | Проверка текста элементов': '#locator-assertions-to-have-text',
        'toHaveAttribute | Проверка атрибута элементов': '#locator-assertions-to-have-attribute',
        'toHaveValue | Проверка значения элементов': '#locator-assertions-to-have-value',
        'toHaveValues | Проверка значений элементов': '#locator-assertions-to-have-values',
        'toBeEnabled | Проверка, что элементы включены': '#locator-assertions-to-be-enabled',
        'toBeDisabled | Проверка, что элементы отключены': '#locator-assertions-to-be-disabled',
        'toBeChecked | Проверка, что элементы отмечены': '#locator-assertions-to-be-checked',
        'toBeAttached | Проверка, что элементы прикреплены': '#locator-assertions-to-be-attached',
        'toBeEditable | Проверка, что элементы редактируемы': '#locator-assertions-to-be-editable',
        'toBeEmpty | Проверка, что элементы пустые': '#locator-assertions-to-be-empty',
        'toBeFocused | Проверка, что элементы сфокусированы': '#locator-assertions-to-be-focused',
        'toBeHidden | Проверка, что элементы скрыты': '#locator-assertions-to-be-hidden',
        'toBeInViewport | Проверка, что элементы находятся в области видимости':
            '#locator-assertions-to-be-in-viewport',
        'toContainText | Проверка содержимого текста элементов': '#locator-assertions-to-contain-text',
        'toHaveClass | Проверка класса элементов': '#locator-assertions-to-have-class',
        'toHaveId | Проверка идентификатора элементов': '#locator-assertions-to-have-id',
        'toHaveJSProperty | Проверка JS-свойства элементов': '#locator-assertions-to-have-js-property',
        'toHaveScreenshot | Проверка скриншота элементов': '#locator-assertions-to-have-screenshot-1',
        'toHaveScreenshot(name) | Проверка скриншота элементов с именем': '#locator-assertions-to-have-screenshot-2',
        '(v.1.44) toHaveAccessibleDescription | Проверка доступного описания элементов':
            '#locator-assertions-to-have-accessible-description',
        '(v.1.44) toHaveAccessibleName | Проверка доступного имени элементов':
            '#locator-assertions-to-have-accessible-name',
        '(v.1.44) toHaveRole | Проверка роли элементов': '#locator-assertions-to-have-role',
    };

    // Команда для открытия документации по Playwright
    let docCommand = vscode.commands.registerCommand('extension.generatePlaywrightHelpTemplate', async () => {
        const functions = Object.keys(functionUrls);

        const selectedFunction = await vscode.window.showQuickPick(functions, {
            placeHolder: 'Выберите функцию Playwright для просмотра документации',
        });

        if (selectedFunction) {
            const url = `https://playwright.dev/docs/api/class-locatorassertions` + functionUrls[selectedFunction];
            vscode.env.openExternal(vscode.Uri.parse(url));
        }
    });

    context.subscriptions.push(docCommand);

    // Команда для генерации основной функции
    let mainFunctionCommand = vscode.commands.registerCommand('extension.generatePlaywrightFunctionTemplate', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const template = `
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locator, expect, test } from '@playwright/test';

interface Check {
    locator: Locator;
    nameSubStep: string;
}

//Проверка видимости элементов
export const expectElementsToBeVisible = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeVisible();
            });
        }
    });
};

// Проверка количества элементов
export const expectElementCount = async (
    nameStep: string,
    checks: { locator: Locator; count: number; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveCount(check.count);
            });
        }
    });
};

// Проверка CSS-свойств элементов
export const expectElementCSS = async (
    nameStep: string,
    checks: { locator: Locator; name: string; value: string | RegExp; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveCSS(check.name, check.value);
            });
        }
    });
};

// Проверка текста элементов
export const expectElementToHaveText = async (
    nameStep: string,
    checks: { locator: Locator; text: string | RegExp; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveText(check.text);
            });
        }
    });
};

// Проверка атрибута элементов
export const expectElementToHaveAttribute = async (
    nameStep: string,
    checks: { locator: Locator; name: string; value: string | RegExp; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveAttribute(check.name, check.value);
            });
        }
    });
};

// Проверка значения элементов
export const expectElementToHaveValue = async (
    nameStep: string,
    checks: { locator: Locator; value: string | RegExp; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveValue(check.value);
            });
        }
    });
};

// Проверка, что элементы включены
export const expectElementToBeEnabled = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeEnabled();
            });
        }
    });
};

// Проверка, что элементы отключены
export const expectElementToBeDisabled = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeDisabled();
            });
        }
    });
};

// Проверка, что элементы отмечены
export const expectElementToBeChecked = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeChecked();
            });
        }
    });
};

// Проверка, что элементы прикреплены
export const expectElementToBeAttached = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeAttached();
            });
        }
    });
};

// Проверка, что элементы редактируемы
export const expectElementToBeEditable = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeEditable();
            });
        }
    });
};

// Проверка, что элементы пустые
export const expectElementToBeEmpty = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeEmpty();
            });
        }
    });
};

// Проверка, что элементы сфокусированы
export const expectElementToBeFocused = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeFocused();
            });
        }
    });
};

// Проверка, что элементы скрыты
export const expectElementToBeHidden = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeHidden();
            });
        }
    });
};

// Проверка, что элементы находятся в области видимости
export const expectElementToBeInViewport = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toBeInViewport();
            });
        }
    });
};

// Проверка содержимого текста элементов
export const expectElementToContainText = async (
    nameStep: string,
    checks: { locator: Locator; text: string | RegExp; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toContainText(check.text);
            });
        }
    });
};

// Проверка класса элементов
export const expectElementToHaveClass = async (
    nameStep: string,
    checks: { locator: Locator; className: string | RegExp; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveClass(check.className);
            });
        }
    });
};

// Проверка идентификатора элементов
export const expectElementToHaveId = async (
    nameStep: string,
    checks: { locator: Locator; id: string; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveId(check.id);
            });
        }
    });
};

// Проверка JS-свойства элементов
export const expectElementToHaveJSProperty = async (
    nameStep: string,
    checks: { locator: Locator; property: string; value: any; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveJSProperty(check.property, check.value);
            });
        }
    });
};

// Проверка скриншота элементов с именем
export const expectElementToHaveScreenshotName = async (
    nameStep: string,
    checks: { locator: Locator; screenshotName: string; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveScreenshot(check.screenshotName);
            });
        }
    });
};

// Проверка скриншота элементов
export const expectElementToHaveScreenshotWithout = async (nameStep: string, checks: Check[]) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveScreenshot();
            });
        }
    });
};

// Проверка значений элементов
export const expectElementToHaveValues = async (
    nameStep: string,
    checks: { locator: Locator; values: any[]; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveValues(check.values);
            });
        }
    });
};

// Доступно в playwright с Version 1.44

/* // Проверка доступного описания элементов
expectElementToHaveAccessibleDescription(
    nameStep: string,
    checks: { locator: Locator; nameSubStep: string; description: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveAccessibleDescription(check.description);
            });
        }
    });
}

// Проверка доступного имени элементов
expectElementToHaveAccessibleName(
    nameStep: string,
    checks: { locator: Locator; name: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveAccessibleName(check.name);
            });
        }
    });
}

// Проверка роли элементов
expectElementToHaveRole(
    nameStep: string,
    checks: { locator: Locator; role: string; nameSubStep: string }[],
) => {
    await test.step(nameStep, async () => {
        for (const check of checks) {
            await test.step(check.nameSubStep, async () => {
                await expect(check.locator).toHaveRole(check.role);
            });
        }
    });
} */

`;
            editor.edit((editBuilder) => {
                editBuilder.insert(editor.selection.active, template);
            });
        }
    });

    context.subscriptions.push(mainFunctionCommand);
}

function generateTemplate(templateType: string, numLines: number): string {
    switch (templateType) {
        case 'toBeVisible | Проверка видимости элементов':
            return `
async expectYourFunctionName() {
    await expectElementsToBeVisible('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveCount | Проверка количества элементов':
            return `
async expectYourFunctionName() {
    await expectElementCount('', [
        ${Array(numLines).fill("{ locator: , count: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveCSS | Проверка CSS-свойств элементов':
            return `
async expectYourFunctionName() {
    await expectElementCSS('', [
        ${Array(numLines).fill("{ locator: , name: '', value: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveText | Проверка текста элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveText('', [
        ${Array(numLines).fill("{ locator: , text: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveAttribute | Проверка атрибута элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveAttribute('', [
        ${Array(numLines).fill("{ locator: , name: '', value: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveValue | Проверка значения элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveValue('', [
        ${Array(numLines).fill("{ locator: , value: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeEnabled | Проверка, что элементы включены':
            return `
async expectYourFunctionName() {
    await expectElementToBeEnabled('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeDisabled | Проверка, что элементы отключены':
            return `
async expectYourFunctionName() {
    await expectElementToBeDisabled('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeChecked | Проверка, что элементы отмечены':
            return `
async expectYourFunctionName() {
    await expectElementToBeChecked('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeAttached | Проверка, что элементы прикреплены':
            return `
async expectYourFunctionName() {
    await expectElementToBeAttached('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeEditable | Проверка, что элементы редактируемы':
            return `
async expectYourFunctionName() {
    await expectElementToBeEditable('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeEmpty | Проверка, что элементы пустые':
            return `
async expectYourFunctionName() {
    await expectElementToBeEmpty('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeFocused | Проверка, что элементы сфокусированы':
            return `
async expectYourFunctionName() {
    await expectElementToBeFocused('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeHidden | Проверка, что элементы скрыты':
            return `
async expectYourFunctionName() {
    await expectElementToBeHidden('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toBeInViewport | Проверка, что элементы находятся в области видимости':
            return `
async expectYourFunctionName() {
    await expectElementToBeInViewport('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toContainText | Проверка содержимого текста элементов':
            return `
async expectYourFunctionName() {
    await expectElementToContainText('', [
        ${Array(numLines).fill("{ locator: , text: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveClass | Проверка класса элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveClass('', [
        ${Array(numLines).fill("{ locator: , className: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveId | Проверка идентификатора элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveId('', [
        ${Array(numLines).fill("{ locator: , id: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveJSProperty | Проверка JS-свойства элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveJSProperty('', [
        ${Array(numLines).fill("{ locator: , property: '', value: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveScreenshot | Проверка скриншота элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveScreenshot('', [
        ${Array(numLines).fill("{ locator: , nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveScreenshot(name) | Проверка скриншота элементов с именем':
            return `
async expectYourFunctionName() {
    await expectElementToHaveScreenshotWithoutName('', [
        ${Array(numLines).fill("{ locator: , screenshotName: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case 'toHaveValues | Проверка значений элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveValues('', [
        ${Array(numLines).fill("{ locator: , values: [''], nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case '(v.1.44) toHaveAccessibleDescription | Проверка доступного описания элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveAccessibleDescription('', [
        ${Array(numLines).fill("{ locator: , description: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case '(v.1.44) toHaveAccessibleName | Проверка доступного имени элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveAccessibleName('', [
        ${Array(numLines).fill("{ locator: , name: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        case '(v.1.44) toHaveRole | Проверка роли элементов':
            return `
async expectYourFunctionName() {
    await expectElementToHaveRole('', [
        ${Array(numLines).fill("{ locator: , role: '', nameSubStep: '' }").join(',\n        ')}
    ]);
}
`;
        default:
            return '';
    }
}

export function deactivate() {}
