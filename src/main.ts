import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';

function loggingInterceptors(request: HttpRequest<unknown>, next:HttpHandlerFn){
    // const req = request.clone({
    //     headers: request.headers.set('X-DEBUG','TESTING')
    // });
    console.log('[Outgoing Request]');
    console.log('Request sent', request);
    //return next(req)
    return next(request).pipe(
        tap({ 
            next: event => {
                if(event.type === HttpEventType.Response){
                    console.log('[Incoming Response]');
                    console.log('Response received', event.status);
                    console.log('Response received', event.body);
                }
            }
        })
    );
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(
        withInterceptors([loggingInterceptors])
    )]
}).catch((err) => console.error(err));
