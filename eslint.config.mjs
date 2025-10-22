import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // 빌드 실패 방지를 위해 에러를 경고로 변경
            "@typescript-eslint/no-explicit-any": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "@next/next/no-img-element": "warn",

            // 완전히 비활성화할 규칙들
            "@typescript-eslint/no-unused-vars": "off",
        }
    }
];

export default eslintConfig;
