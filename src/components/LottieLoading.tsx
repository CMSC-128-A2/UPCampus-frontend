'use client';

import Lottie from 'lottie-react';
import loadingAnimation from '../../public/assets/animations/loading.json';

export default function LottieLoading() {
    return (
        <div className="h-full flex items-center justify-center">
            <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{ width: 200, height: 200 }}
            />
        </div>
    );
}
